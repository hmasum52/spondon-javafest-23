package com.github.mjksabit.spondon.service;

import com.github.mjksabit.spondon.model.DoctorUser;
import com.github.mjksabit.spondon.model.PatientUser;
import com.github.mjksabit.spondon.model.User;
import com.github.mjksabit.spondon.util.JwtTokenUtil;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Slice;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.ValidationException;
import java.util.Collections;
import java.util.regex.Pattern;

import static com.github.mjksabit.spondon.service.UserService.EMAIL_KEY;

@Service
public class AuthService {
    public static final String JWT_KEY              = "jwt";
    public static final String OLD_KEY              = "old";
    public static final String NEW_KEY              = "new";

    public static final String USERNAME_KEY         = "username";
    public static final String PASSWORD_KEY         = "password";

    public static final String ROLE_USER            = "USER";
    public static final String ROLE_DOCTOR          = "DOCTOR";
    public static final String ROLE_HOSPITAL        = "HOSTPITAL";
    public static final String ROLE_ADMIN           = "ADMIN";

    public static final String VERIFY_ACTIVATE      = "activate";
    public static final String VERIFY_FORGOT        = "forgot";
    public static final String VERIFY_ADD_DOCTOR    = "add-doctor";

    public static final Pattern USERNAME_MATCHER = Pattern.compile(
            "^[A-Za-z]\\w{4,29}$"
    );
    public static final Pattern PASSWORD_MATCHER = Pattern.compile(
            "^.{8,20}$"
    );
    public static final Pattern EMAIL_MATCHER = Pattern.compile(
            "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}"
    );

    private final static Logger logger = LogManager.getLogger(AuthService.class);

    @Value("${BASE_URL:http://localhost:8080}")
    String BASE_URL;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    String FRONTEND_URL;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    PatientUserService patientUserService;

    @Autowired
    EmailService emailService;

    @Autowired
    DoctorUserService doctorUserService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserLogService userLogService;

    public JSONObject login(JSONObject loginData) throws DisabledException, BadCredentialsException {
        String username = loginData.getString(USERNAME_KEY);
        String password = loginData.getString(PASSWORD_KEY);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        logger.info("Logged in User: {}", username);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtTokenUtil.generateToken(userDetails);

        JSONObject data = new JSONObject();
        data.put(JWT_KEY, token);

        userLogService.log(username, "Logged In");

        return data;
    }

    private boolean isValid(User user) {
        String username = user.getUsername(), email = user.getEmail(), password = user.getPassword();
        return USERNAME_MATCHER.matcher(username).matches() &&
                PASSWORD_MATCHER.matcher(password).matches() &&
                EMAIL_MATCHER.matcher(email).matches();
    }

    @Transactional
    public void registerNewUser(JSONObject signUpData) throws ValidationException {
        User user = userService.retrieveUser(new User(), signUpData);

        if (userService.hasUser(user))
            throw new ValidationException("User already exists");

        saveWithRawPassword(user);

        String jwtVerification = jwtTokenUtil.generateVerifyToken(user.getUsername(), user.getEmail(), VERIFY_ACTIVATE);
        emailService.sendEmail(
                Collections.singletonList(user.getEmail()),
                "Confirm Your Account",
                "Go to the link below to activate your Spondon Account \n" +
                        "[Sorry for <"+FRONTEND_URL+">, I was blocked and site was flagged not safe]\n"+
                        FRONTEND_URL+"/auth/activate/"+jwtVerification
        );
    }

    private void saveWithRawPassword(User user) throws ValidationException {

        if (!isValid(user))
            throw new ValidationException("Invalid Data Provided");

        userService.saveWithRawPassword(user, ROLE_USER);
    }

    @Transactional
    public boolean activateUser(JSONObject object) {
        String jwtVerify = object.getString(JWT_KEY);
        String username = jwtTokenUtil.validateAndGetUsernameFromToken(jwtVerify, VERIFY_ACTIVATE);

        if (username == null)
            return false;

        User user = userService.findByUsername(username);
        if (user == null)
            return false;

        user.setActive(true);
        userService.update(user);
        try {
            PatientUser patientUser = patientUserService.retrieve(new PatientUser(), object);
            patientUser.setId(user.getId());
            patientUser.setUser(user);
            logger.log(Level.INFO, "User Activated: {}", patientUser);
            patientUserService.save(patientUser);
            userLogService.log(user, "Activated");
            return true;
        } catch (Exception e) {
            logger.log(Level.ERROR, "User Activation Failed: {}", e.getMessage());
            return false;
        }

    }

    public boolean forgotPassword(JSONObject data) {
        User user = userService.findByEmail(data.getString(EMAIL_KEY));

        if (user == null)
            return false;

        String jwtVerification = jwtTokenUtil.generateVerifyToken(
                user.getUsername(), user.getEmail(), VERIFY_FORGOT);

        emailService.sendEmail(
                Collections.singletonList(user.getEmail()),
                "Confirm Password Reset",
                "Go to the link below to reset your Spondon Account Password\n"+
                        "[Sorry for <"+FRONTEND_URL+">, I was blocked and site was flagged not safe]\n"+
                        FRONTEND_URL+"/auth/forget-password?token="+jwtVerification
        );

        userLogService.notify(user, "Forgot Password Request");

        return true;
    }

    public boolean resetPassword(JSONObject object) {
        String jwtVerify = object.getString(JWT_KEY);
        String password = object.getString(PASSWORD_KEY);
        String username = jwtTokenUtil.validateAndGetUsernameFromToken(jwtVerify, VERIFY_FORGOT);

        if (username == null)
            return false;

        User user = userService.findByUsername(username);
        user.setPassword(password);
        userService.saveWithRawPassword(user);

        userLogService.log(user, "Password Reset Success");

        return true;
    }

    public boolean addDoctorRequest(String email) {
        User user = userService.findByEmail(email);
        if (user != null)
            return false;

        String jwtVerification = jwtTokenUtil.generateVerifyToken(
                email, email, VERIFY_ADD_DOCTOR);
        emailService.sendEmail(
                Collections.singletonList(email),
                "Confirm Doctor Account",
                "Go to the link below to activate your Spondon Doctor Account \n" +
                        "[Sorry for <"+FRONTEND_URL+">, I was blocked and site was flagged not safe]\n"+
                        FRONTEND_URL+"/auth/doctor/"+jwtVerification
        );
        return true;
    }

    public boolean activateDoctor(JSONObject object) {
        String jwtVerify = object.getString(JWT_KEY);
        String email = jwtTokenUtil.validateAndGetUsernameFromToken(jwtVerify, VERIFY_ADD_DOCTOR);

        if (email == null)
            return false;

        object.put(EMAIL_KEY, email);
        User user = userService.retrieveUser(new User(), object);
        user.setActive(true);
        user.setPublicKey(object.getString("publicKey"));
        userService.saveWithRawPassword(user, ROLE_DOCTOR);

        try {
            DoctorUser doctorUser = doctorUserService.retrieve(new DoctorUser(), object);
            doctorUser.setId(user.getId());
            doctorUserService.save(doctorUser);
        } catch (Exception e) {
            logger.log(Level.ERROR, "Doctor Activation Failed: {}", e.getMessage());
            return false;
        }

        userLogService.log(user, "Doctor Account Activated");

        return true;
    }
}

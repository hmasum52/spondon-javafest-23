package com.github.mjksabit.spondon.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.github.mjksabit.spondon.consts.View;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SimpleController {
    @GetMapping("/")
    @JsonView(View.Public.class)
    public String index() {
        return "Hello World!";
    }
}

package com.github.mjksabit.spondon.config;

public class View {
    public static class Public { }
    public static class ExtendedPublic extends Public { }
    public static class Private extends ExtendedPublic { }
}

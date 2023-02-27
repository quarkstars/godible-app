package com.godible.app;

//Added for Android Google Sign in
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

import com.getcapacitor.BridgeActivity;


public class MainActivity extends BridgeActivity {

    // Added for Android Google Sign In
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState)
        this.registerPlugin(GoogleAuth.class);
    }
}


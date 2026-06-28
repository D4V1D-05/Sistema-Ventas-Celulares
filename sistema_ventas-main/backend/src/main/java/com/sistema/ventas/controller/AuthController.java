package com.sistema.ventas.controller;

import com.sistema.ventas.dto.LoginRequest;
import com.sistema.ventas.dto.LoginResponse;
import com.sistema.ventas.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "API para el inicio de sesión")
public class AuthController {
    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión en el sistema")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }
}

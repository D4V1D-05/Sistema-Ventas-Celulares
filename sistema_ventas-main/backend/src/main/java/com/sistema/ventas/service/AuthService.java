package com.sistema.ventas.service;

import com.sistema.ventas.dto.LoginRequest;
import com.sistema.ventas.dto.LoginResponse;
import com.sistema.ventas.model.Usuario;
import com.sistema.ventas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }


    private final UsuarioRepository usuarioRepository;

    public LoginResponse login(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsernameAndPassword(
                request.getUsername(), request.getPassword());

        if (usuarioOpt.isEmpty()) {
            return new LoginResponse(false, "Usuario o contraseña incorrectos", null);
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.getRol().equals(request.getRol())) {
            return new LoginResponse(false, "El rol seleccionado no corresponde al usuario", null);
        }

        if (!usuario.isActivo()) {
            return new LoginResponse(false, "El usuario está desactivado", null);
        }

        return new LoginResponse(true, "Login exitoso", usuario);
    }
}

package com.flora.backend.service;

import com.flora.backend.model.User;
import com.flora.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Kullanıcı Kayıt Metodu
    public User registerUser(User user) {
        // E-posta daha önce alınmış mı kontrol et
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanımda!");
        }
        return userRepository.save(user);
    }

    // Kullanıcı Giriş Metodu
    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Veritabanındaki şifre ile gelen şifre eşleşiyor mu?
            if (user.getPassword().equals(password)) {
                return user; // Giriş başarılı, kullanıcı nesnesini dön
            }
        }
        throw new RuntimeException("E-posta veya şifre hatalı!");
    }
}
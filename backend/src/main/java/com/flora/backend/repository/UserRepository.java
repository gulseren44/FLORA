package com.flora.backend.repository;

import com.flora.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // E-posta adresine göre kullanıcıyı veritabanından getiren özel metot
    Optional<User> findByEmail(String email);
}
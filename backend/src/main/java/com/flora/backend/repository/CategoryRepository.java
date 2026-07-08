package com.flora.backend.repository;

import com.flora.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Kategori anahtarına (ic-mekan vb.) göre arama yapmak için özel sorgu metodu
    Optional<Category> findByCategoryKey(String categoryKey);
}
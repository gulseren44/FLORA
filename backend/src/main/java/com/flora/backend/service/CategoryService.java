package com.flora.backend.service;

import com.flora.backend.model.Category;
import com.flora.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor // Repository'yi otomatik enjekte (Inject) eder
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Tüm kategorileri listele
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Yeni kategori ekle
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}
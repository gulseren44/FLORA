package com.flora.backend.controller;

import com.flora.backend.model.Category;
import com.flora.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Frontend'den istek atarken CORS hatası almamak için
public class CategoryController {

    private final CategoryService categoryService;

    // Tüm kategorileri listele: GET http://localhost:8085/api/categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // Yeni kategori ekle: POST http://localhost:8085/api/categories
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }
}
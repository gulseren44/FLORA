package com.flora.backend.service;

import com.flora.backend.model.Product;
import com.flora.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Tüm ürünleri listele
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Belirli kategoriye ait ürünleri getir
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // Sadece favori bitkileri listele
    public List<Product> getFavoriteProducts() {
        return productRepository.findByIsFavoriteTrue();
    }

    // Yeni bitki (ürün) ekle
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Tek bir ürünü ID ile getir
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bitki bulunamadı! ID: " + id));
    }

    // İsme göre büyük/küçük harf duyarsız arama yap 
    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public Product save(Product p) { return productRepository.save(p); }

    public void deleteById(Long id) { productRepository.deleteById(id); }

    public Product findById(Long id) { return productRepository.findById(id).orElse(null); }

    
}
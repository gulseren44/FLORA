package com.flora.backend.controller;

import com.flora.backend.model.Product;
import com.flora.backend.service.ProductService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductController {

    private final ProductService productService;

    // Ürünleri listele veya İsme göre ara: GET http://localhost:8085/api/products veya GET http://localhost:8085/api/products?search=Lavanta
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return productService.searchProducts(search);
        }
        return productService.getAllProducts();
    }

    // Kategoriye göre filtrele: GET http://localhost:8085/api/products/category/{id}
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    // Sadece favorileri getir: GET http://localhost:8085/api/products/favorites
    @GetMapping("/favorites")
    public List<Product> getFavoriteProducts() {
        return productService.getFavoriteProducts();
    }

    // Yeni Ürün Ekleme Endpoint'i: POST /api/products
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
     try {
        // Service katmanındaki save metodunu çağırıyoruz
        Product savedProduct = productService.save(product); 
        return ResponseEntity.ok(savedProduct);
     } catch (Exception e) {
        return ResponseEntity.badRequest().build();
     }
    }

    // Ürün Silme Endpoint'i: DELETE /api/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
      try {
        productService.deleteById(id); // Service katmanındaki silme metodunu çağırıyoruz
        return ResponseEntity.ok(Map.of("message", "Ürün başarıyla silindi."));
      } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Ürün silinirken bir hata oluştu."));
      }
    }

    // Ürün Güncelleme Endpoint'i: PUT /api/products/1
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
      try {
        // Service katmanından güncellenecek ürünü buluyoruz
        Product existingProduct = productService.findById(id); // Varsa findById metodun
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        // Bilgileri yeni gelen verilerle güncelliyoruz
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setScientificName(updatedProduct.getScientificName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setDescription(updatedProduct.getDescription());
        if (updatedProduct.getCategory() != null) {
            existingProduct.setCategory(updatedProduct.getCategory());
        }

        // Güncellenmiş halini veritabanına kaydediyoruz
        Product savedProduct = productService.save(existingProduct);
        return ResponseEntity.ok(savedProduct);
     } catch (Exception e) {
        return ResponseEntity.badRequest().body("{\"message\": \"Ürün güncellenirken bir hata oluştu.\"}");
     }
   }
    
    // Tek bir ürünün detayını getir: GET http://127.0.0.1:8085/api/products/{id}
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}
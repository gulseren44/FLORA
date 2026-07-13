package com.flora.backend.controller;

import com.flora.backend.model.Product;
import com.flora.backend.service.ProductService;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Gauge;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductController {

    private final ProductService productService;
    private final MeterRegistry meterRegistry; // Prometheus kayıt defteri

    // 1. Havada asılı duran anlık istek sayısını tutacak thread-safe değişken
    private final AtomicInteger activeRequests = new AtomicInteger(0);

    // 2. Uygulama ayağa kalkarken bu değişkeni Prometheus'a "Gauge" olarak kaydediyoruz
    @PostConstruct
    public void initGauge() {
        Gauge.builder("http_server_requests_in_progress", activeRequests, AtomicInteger::get)
             .description("Anlık olarak işlenen aktif istek sayısı")
             .register(meterRegistry);
    }

    // Ürünleri listele veya İsme göre ara: GET http://localhost:8085/api/products
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String search) {
        activeRequests.incrementAndGet(); // Aktif istek sayısını 1 arttır
        try {
            // Dinamik Etiketleme: İstek geldiğinde çalışır ve durum kodu başarılı (200) kabul edilir.
            meterRegistry.counter("http_server_requests", "uri", "/api/products", "method", "GET", "status", "200").increment();
            
            if (search != null && !search.trim().isEmpty()) {
                return productService.searchProducts(search);
            }
            return productService.getAllProducts();
        } finally {
            activeRequests.decrementAndGet(); // İstek yanıtlandığında sayıyı 1 azalt
        }
    }

    // Kategoriye göre filtrele: GET http://localhost:8085/api/products/category/{id}
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        activeRequests.incrementAndGet();
        try {
            meterRegistry.counter("http_server_requests", "uri", "/api/products/category/{id}", "method", "GET", "status", "200").increment();
            return productService.getProductsByCategory(categoryId);
        } finally {
            activeRequests.decrementAndGet();
        }
    }

    // Sadece favorileri getir: GET http://localhost:8085/api/products/favorites
    @GetMapping("/favorites")
    public List<Product> getFavoriteProducts() {
        activeRequests.incrementAndGet();
        try {
            meterRegistry.counter("http_server_requests", "uri", "/api/products/favorites", "method", "GET", "status", "200").increment();
            return productService.getFavoriteProducts();
        } finally {
            activeRequests.decrementAndGet();
        }
    }

    // Yeni Ürün Ekleme Endpoint'i: POST /api/products
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        activeRequests.incrementAndGet();
        try {
            Product savedProduct = productService.save(product); 
            // Başarılı kayıtta 200 etiketiyle sayacı arttır
            meterRegistry.counter("http_server_requests", "uri", "/api/products", "method", "POST", "status", "200").increment();
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            // Hata durumunda 400 etiketiyle sayacı arttır
            meterRegistry.counter("http_server_requests", "uri", "/api/products", "method", "POST", "status", "400").increment();
            return ResponseEntity.badRequest().build();
        } finally {
            activeRequests.decrementAndGet();
        }
    }

    // Ürün Silme Endpoint'i: DELETE /api/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        activeRequests.incrementAndGet();
        try {
            productService.deleteById(id); 
            meterRegistry.counter("http_server_requests", "uri", "/api/products/{id}", "method", "DELETE", "status", "200").increment();
            return ResponseEntity.ok(Map.of("message", "Ürün başarıyla silindi."));
        } catch (Exception e) {
            meterRegistry.counter("http_server_requests", "uri", "/api/products/{id}", "method", "DELETE", "status", "400").increment();
            return ResponseEntity.badRequest().body(Map.of("message", "Ürün silinirken bir hata oluştu."));
        } finally {
            activeRequests.decrementAndGet();
        }
    }

    // Ürün Güncelleme Endpoint'i: PUT /api/products/1
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        activeRequests.incrementAndGet();
        try {
            Product existingProduct = productService.findById(id); 
            if (existingProduct == null) {
                meterRegistry.counter("http_server_requests", "uri", "/api/products/{id}", "method", "PUT", "status", "404").increment();
                return ResponseEntity.notFound().build();
            }

            existingProduct.setName(updatedProduct.getName());
            existingProduct.setScientificName(updatedProduct.getScientificName());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setImageUrl(updatedProduct.getImageUrl());
            existingProduct.setDescription(updatedProduct.getDescription());
            if (updatedProduct.getCategory() != null) {
                existingProduct.setCategory(updatedProduct.getCategory());
            }

            Product savedProduct = productService.save(existingProduct);
            meterRegistry.counter("http_server_requests", "uri", "/api/products/{id}", "method", "PUT", "status", "200").increment();
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            meterRegistry.counter("http_server_requests", "uri", "/api/products/{id}", "method", "PUT", "status", "400").increment();
            return ResponseEntity.badRequest().body("{\"message\": \"Ürün güncellenirken bir hata oluştu.\"}");
        } finally {
            activeRequests.decrementAndGet();
        }
    }
    
    // Tek bir ürünün detayını getir: GET http://127.0.0.1:8085/api/products/{id}
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        activeRequests.incrementAndGet();
        try {
            meterRegistry.counter("http_server_requests", "uri", "/api/products/{id}", "method", "GET", "status", "200").increment();
            return productService.getProductById(id);
        } finally {
            activeRequests.decrementAndGet();
        }
    }
}
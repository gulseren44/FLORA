package com.flora.backend.repository;

import com.flora.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Belirli bir kategoriye ait ürünleri listelemek için
    List<Product> findByCategoryId(Long categoryId);
    
    // Sadece favori olarak işaretlenmiş ürünleri getirmek için
    List<Product> findByIsFavoriteTrue();

    // Bitki ismine göre büyük/küçük harf duyarsız arama yapmak için 
    List<Product> findByNameContainingIgnoreCase(String name);
}
package com.reservaya.reservaya_backend.service;

import com.reservaya.reservaya_backend.entity.AppUser;
import com.reservaya.reservaya_backend.exception.NotFoundException;
import com.reservaya.reservaya_backend.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

  private final AppUserRepository userRepo;

  public UserService(AppUserRepository userRepo) {
    this.userRepo = userRepo;
  }

  public AppUser getById(Long id) {
    return userRepo.findById(id)
        .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
  }
}
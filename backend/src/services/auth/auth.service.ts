import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { env } from '../../config/env.js';
import { UserRepository } from '../../repositories/users/user.repository.js';
import { UnauthorizedError, NotFoundError } from '../../helpers/errors.js';
import { supabasePublic } from '../../config/supabase.js';

const userRepository = new UserRepository();

export class AuthService {
  async login(email: string, passwordString: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabasePublic.auth.signInWithPassword({
      email: normalizedEmail,
      password: passwordString,
    });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const authenticatedEmail = data.user.email?.trim().toLowerCase();
    if (!authenticatedEmail) throw new UnauthorizedError('A conta Supabase não possui email');

    let user = await userRepository.findByEmail(authenticatedEmail);
    if (!user && authenticatedEmail === env.ADMIN_EMAIL.trim().toLowerCase()) {
      user = await userRepository.create({
        email: authenticatedEmail,
        password: await bcrypt.hash(randomBytes(32).toString('hex'), 12),
        name: data.user.user_metadata?.full_name || authenticatedEmail.split('@')[0],
        role: 'ADMIN',
        isActive: true,
      });
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuário sem perfil ativo no sistema');
    }

    return { user, token: data.session.access_token };
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('Usuário');
    return user;
  }

  async generateMagicLink(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    return jwt.sign({ id: user.id, type: 'magic_link' }, env.JWT_SECRET, { expiresIn: '1h' });
  }
}

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UserRepository } from '../../repositories/users/user.repository.js';
import { UnauthorizedError, NotFoundError } from '../../helpers/errors.js';
import prisma from '../../config/database.js';

const userRepository = new UserRepository();

export class AuthService {
  async login(email: string, passwordString: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) throw new UnauthorizedError('Credenciais inválidas ou usuário inativo');

    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!fullUser) throw new UnauthorizedError('Credenciais inválidas');

    const isValid = await bcrypt.compare(passwordString, fullUser.password);
    if (!isValid) throw new UnauthorizedError('Credenciais inválidas');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );
    return { user, token };
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('Usuário');
    return user;
  }

  async generateMagicLink(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    const token = jwt.sign({ id: user.id, type: 'magic_link' }, env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
}

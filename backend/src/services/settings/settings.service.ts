import { SettingRepository } from '../../repositories/settings/setting.repository';

const repo = new SettingRepository();

export class SettingsService {
  async getAll() { return repo.getAll(); }
  async update(settings: {key: string, value: string}[]) {
    for (const {key, value} of settings) await repo.set(key, value);
    return true;
  }
}

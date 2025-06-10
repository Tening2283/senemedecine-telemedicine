import { registerAs } from '@nestjs/config';

export const orthancConfig = registerAs('orthanc', () => ({
  url: process.env.ORTHANC_URL || 'http://localhost:8042',
  username: process.env.ORTHANC_USERNAME || 'orthanc',
  password: process.env.ORTHANC_PASSWORD || 'orthanc',
  timeout: parseInt(process.env.ORTHANC_TIMEOUT, 10) || 30000,
  maxRetries: parseInt(process.env.ORTHANC_MAX_RETRIES, 10) || 3,
  retryDelay: parseInt(process.env.ORTHANC_RETRY_DELAY, 10) || 1000,
}));

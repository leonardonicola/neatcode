import { Injectable } from '@nestjs/common';
import { db } from '@neatcode/db';

@Injectable()
export class AppService {
  async getData() {
    const user = await db
      .selectFrom('user')
      .select('first_name')
      .executeTakeFirst();
    return { message: user?.first_name ?? 'None' };
  }
}

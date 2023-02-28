import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, getUserByUsername } from '../../../../database/users';

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const result = userSchema.safeParse(body);

  if (!result.success) {
    // Inside of result.error.issues you are going to have more granular information about what is failing allowing you to create more specific error massages
    // console.log(result.error.issues);

    return NextResponse.json(
      {
        errors: result.error.issues,
      },
      { status: 400 },
    );
  }

  if (!result.data.username || !result.data.password) {
    return NextResponse.json(
      { errors: [{ message: 'username or password is empty' }] },
      { status: 400 },
    );
  }

  const user = await getUserByUsername(result.data.username);

  if (user) {
    return NextResponse.json(
      { errors: [{ message: 'username is already taken' }] },
      { status: 401 },
    );
  }

  // 3. we hash the password
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  const newUser = await createUser(result.data.username, passwordHash);

  return NextResponse.json({ user: { username: newUser.username } });
};

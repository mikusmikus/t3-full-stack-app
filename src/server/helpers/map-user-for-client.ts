import { type User } from '@clerk/nextjs/dist/types/server'

export const mapUserForClient = (user: User) => {
  return {
   id: user.id,
   username: user.username,
   firstName: user.firstName,
   lastName: user.lastName,
   profilePicture: user.profileImageUrl, 
   email: user.emailAddresses[0]?.emailAddress
  }
}
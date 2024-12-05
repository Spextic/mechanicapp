import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";

export const AuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization:
                "https://discord.com/api/oauth2/authorize?scope=identify+guilds+guilds.members.read",
        }),
    ],

    callbacks: {
        async jwt({ token, account, profile }) {
            // Add Discord ID to the token if the user is logging in for the first time
            if (account && profile) {
                token.discordId = profile.id;
                token.accessToken = account.access_token;  // Store the access token for API requests
            }
            return token;
        },

        async session({ session, token }) {
            // Add the Discord ID and roles to the session
            session.user.discordId = token.discordId;

            // If roles are available, add them to the session
            if (token.roles) {
                session.user.roles = token.roles;
            }
            return session;
        },

        async signIn({ user, account, profile }) {
            if (account && account.access_token) {
                // Fetch user roles from Discord using the access token
                const response = await fetch(
                    `https://discord.com/api/v10/users/@me/guilds`,
                    {
                        headers: {
                            Authorization: `Bearer ${account.access_token}`,
                        },
                    }
                );

                const guilds = await response.json();
                
                // Get roles for each guild the user is part of
                const userRoles = [];
                for (const guild of guilds) {
                    const guildResponse = await fetch(
                        `https://discord.com/api/v10/guilds/${guild.id}/members/${profile.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${account.access_token}`,
                            },
                        }
                    );

                    const memberData = await guildResponse.json();
                    if (memberData.roles) {
                        userRoles.push(...memberData.roles);
                    }
                }

                // Add roles to the token for future reference
                if (userRoles.length > 0) {
                    user.roles = userRoles;
                }
            }

            return true;
        },

        async redirect({ url, baseUrl }) {
            return baseUrl + "/dashboard";
        },
    },
};

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };

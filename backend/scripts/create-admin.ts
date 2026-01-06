import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
    // ⚠️ MUDE ESTAS INFORMAÇÕES
    const email = 'admin@portfolio.com';
    const password = 'Admin@123';
    const fullName = 'Roberto Silva';

    try {
        // Verificar se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log('❌ Usuário com este email já existe!');
            console.log('Email:', existingUser.email);
            console.log('ID:', existingUser.id);
            return;
        }

        // Criar hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário admin
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
            },
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Email:', user.email);
        console.log('Senha:', password);
        console.log('Nome:', user.fullName);
        console.log('ID:', user.id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 Use estas credenciais para fazer login!');
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
        throw error;
    }
}

createAdmin()
    .catch((e) => {
        console.error('Erro fatal:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

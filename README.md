# Barbearia Seu Pedro

Sistema completo para barbearia com frontend, admin e backend.

## 🚀 Deploy

### Frontend (Hostinger)
```bash
cd frontend
npm install
npm run build
# Upload pasta dist/ para Hostinger
```

### Backend (Railway)
1. Conectar repositório no Railway
2. Configurar variáveis de ambiente:
   - `FIREBASE_PROJECT_ID=barbearia---seu-pedro`
   - `FIREBASE_PRIVATE_KEY` (chave privada do Firebase Admin)
   - `FIREBASE_CLIENT_EMAIL` (email do service account)
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` (opcional)

### Admin
```bash
cd admin
npm install
npm run build
# Deploy separado ou junto com frontend
```

## 📋 Próximos Passos

1. **Firebase Admin SDK**: Baixar chave privada do Firebase Console
2. **Email**: Configurar SMTP para notificações
3. **Domínio**: Configurar DNS no Hostinger
4. **CORS**: Atualizar URLs de produção no backend
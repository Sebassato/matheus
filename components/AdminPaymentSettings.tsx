import React, { useState, useEffect } from 'react';

const AdminPaymentSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        pixKey: '',
        pixRecipientName: '',
        cardApiKey: '',
        debitApiKey: '',
        pixApiKey: '',
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('paymentSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(prev => ({ ...prev, ...parsedSettings }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('paymentSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-neon-yellow mb-6">Configurações de Pagamento</h2>
            <div className="space-y-6 bg-medium-gray p-6 rounded-lg">
                
                <div>
                    <h3 className="text-lg font-semibold text-neon-blue mb-3">Configuração PIX</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Chave PIX para QR Code</label>
                            <input
                                type="text"
                                name="pixKey"
                                value={settings.pixKey}
                                onChange={handleChange}
                                placeholder="Ex: seuemail@dominio.com ou CNPJ"
                                className="w-full bg-dark-gray border-gray-600 rounded-md p-2 focus:border-neon-blue focus:ring-neon-blue"
                            />
                            <p className="text-xs text-gray-400 mt-1">Essa chave será usada para gerar o QR Code e o "copia e cola" no checkout.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Beneficiário (PIX)</label>
                            <input
                                type="text"
                                name="pixRecipientName"
                                value={settings.pixRecipientName}
                                onChange={handleChange}
                                placeholder="Nome da sua empresa ou seu nome completo"
                                className="w-full bg-dark-gray border-gray-600 rounded-md p-2 focus:border-neon-blue focus:ring-neon-blue"
                            />
                            <p className="text-xs text-gray-400 mt-1">Este nome aparecerá para o cliente ao realizar o pagamento PIX.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dark-gray"></div>

                <div>
                    <h3 className="text-lg font-semibold text-neon-blue mb-3">Configuração Cartões</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">API Key de Pagamento (Crédito)</label>
                            <input
                                type="password"
                                name="cardApiKey"
                                value={settings.cardApiKey}
                                onChange={handleChange}
                                placeholder="Ex: pk_live_xxxxxxxxxxxxxx"
                                className="w-full bg-dark-gray border-gray-600 rounded-md p-2 focus:border-neon-blue focus:ring-neon-blue"
                            />
                            <p className="text-xs text-gray-400 mt-1">Insira a chave da sua API de pagamento para cartões de crédito.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">API Key de Pagamento (Débito)</label>
                            <input
                                type="password"
                                name="debitApiKey"
                                value={settings.debitApiKey}
                                onChange={handleChange}
                                placeholder="Ex: pk_live_xxxxxxxxxxxxxx_debit"
                                className="w-full bg-dark-gray border-gray-600 rounded-md p-2 focus:border-neon-blue focus:ring-neon-blue"
                            />
                            <p className="text-xs text-gray-400 mt-1">Insira a chave da sua API de pagamento para cartões de débito.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dark-gray"></div>
                
                <div>
                    <h3 className="text-lg font-semibold text-neon-blue mb-3">Automação</h3>
                    <label className="block text-sm font-medium text-gray-300 mb-1">API Key de Pagamento (PIX Automático)</label>
                    <input
                        type="password"
                        name="pixApiKey"
                        value={settings.pixApiKey}
                        onChange={handleChange}
                        placeholder="Chave para automação de PIX"
                        className="w-full bg-dark-gray border-gray-600 rounded-md p-2 focus:border-neon-blue focus:ring-neon-blue"
                    />
                     <p className="text-xs text-gray-400 mt-1">Para integrações futuras com confirmação automática de pagamento PIX.</p>
                </div>
            </div>
            <div className="mt-6 flex items-center">
                <button
                    onClick={handleSave}
                    className="bg-neon-blue text-black font-bold py-2 px-6 rounded-lg hover:opacity-80 transition-opacity"
                >
                    Salvar Configurações
                </button>
                {saved && <span className="ml-4 text-green-400">Configurações salvas com sucesso!</span>}
            </div>
        </div>
    );
};

export default AdminPaymentSettings;
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import { api } from '../services/apiService';
import { CartItem } from '../types';

interface CheckoutViewProps {
    onCheckoutSuccess: (orderData: {
        customerName: string,
        total: number,
        products: CartItem[],
        deliveryDate: string,
        deliveryTime: string,
        customerPhone: string,
        address: string,
    }) => void;
}

type CheckoutStep = 'details' | 'payment';
type PaymentMethod = 'pix' | 'card' | 'debit' | 'boleto';

const CheckoutView: React.FC<CheckoutViewProps> = ({ onCheckoutSuccess }) => {
    const { cart, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState<CheckoutStep>('details');
    
    // Form state
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
    
    // Control state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Payment settings
    const [paymentSettings, setPaymentSettings] = useState({
        pixKey: '',
        pixRecipientName: '',
        cardApiKey: '',
        debitApiKey: '',
        pixApiKey: '',
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('paymentSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setPaymentSettings(prev => ({...prev, ...parsed}));
        }
    }, []);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            setError('Seu carrinho está vazio.');
            return;
        }
        setError('');
        setStep('payment');
    };

    const handlePaymentConfirmation = async () => {
        setIsLoading(true);
        setError('');

        try {
            const orderData = {
                customerName,
                address,
                whatsapp,
                deliveryDateTime: `${deliveryDate}T${deliveryTime}`,
                paymentMethod,
                items: cart,
                total: cartTotal,
            };

            const newOrder = await api.submitOrder(orderData);
            // Simulate payment processing based on method
            const paymentResult = await api.processPayment(newOrder.id);

            if (paymentResult.success) {
                onCheckoutSuccess({
                    customerName,
                    total: cartTotal,
                    products: cart,
                    deliveryDate,
                    deliveryTime,
                    customerPhone: whatsapp,
                    address,
                });
                clearCart();
            } else {
                throw new Error(paymentResult.message);
            }
        } catch (err) {
            setError('Ocorreu um erro ao processar seu pedido. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const qrCodeUrl = useMemo(() => {
        if (paymentMethod === 'pix' && paymentSettings.pixKey) {
            // Simplified payload for demonstration. A real app would use a library to generate a valid BR Code.
            const payload = `
Para pagar, use a chave PIX (Copia e Cola) abaixo no seu app de banco.
Beneficiário: ${paymentSettings.pixRecipientName || 'Nome não configurado'}
Valor: R$ ${cartTotal.toFixed(2)}
`.trim();
            // We encode this informative text. The key itself is shown below the QR code for copy-paste.
            return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}`;
        }
        return '';
    }, [paymentMethod, paymentSettings.pixKey, paymentSettings.pixRecipientName, cartTotal]);


    const renderDetailsStep = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-dark-gray p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-neon-yellow mb-6">1. Informações de Entrega</h2>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nome Completo</label>
                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Endereço Completo</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">WhatsApp (com DDD)</label>
                        <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required placeholder="21999998888" className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Data de Entrega</label>
                            <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Hora de Entrega</label>
                            <input type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} required className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">Método de Pagamento</h3>
                        <div className="space-y-2">
                            {([
                                ['pix', 'PIX'], 
                                ['card', 'Cartão de Crédito'],
                                ['debit', 'Cartão de Débito'],
                                ['boleto', 'Boleto']
                            ] as const).map(([method, label]) => (
                                <label key={method} className="flex items-center p-3 bg-medium-gray rounded-lg cursor-pointer">
                                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="h-4 w-4 text-neon-blue focus:ring-neon-blue border-gray-500" />
                                    <span className="ml-3 text-white">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-6 bg-neon-blue text-black font-bold py-3 px-4 rounded-md hover:opacity-80 transition-transform transform hover:scale-105">
                        Ir para o Pagamento
                    </button>
                </form>
            </div>
            <div className="bg-dark-gray p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-neon-yellow mb-6">Resumo do Pedido</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                             <div className="flex">
                                <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div>
                                    <p className="font-semibold">{item.name} <span className="text-gray-400">x{item.quantity}</span></p>
                                    <p className="text-sm text-gray-400 capitalize">Aluguel</p>
                                </div>
                            </div>
                            <p className="font-semibold text-right">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-6 border-t border-medium-gray space-y-2">
                    <div className="flex justify-between text-xl font-bold mt-4">
                        <p>Total</p>
                        <p className="text-neon-yellow">R$ {cartTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderPaymentStep = () => (
         <div className="bg-dark-gray p-8 rounded-lg max-w-3xl mx-auto">
            <button onClick={() => setStep('details')} className="text-neon-blue hover:underline mb-6">&larr; Voltar para as informações</button>
            <h2 className="text-2xl font-bold text-neon-yellow mb-2">2. Pagamento</h2>
            <p className="text-lg text-gray-300 mb-6">Total a pagar: <span className="font-bold text-neon-yellow">R$ {cartTotal.toFixed(2)}</span></p>

            {paymentMethod === 'pix' && (
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Pague com PIX</h3>
                    {paymentSettings.pixKey ? (
                        <>
                            <p className="mb-2">Você está pagando para:</p>
                            <p className="font-bold text-lg text-neon-yellow mb-4">{paymentSettings.pixRecipientName || 'Beneficiário não informado'}</p>

                            <p className="mb-4">Escaneie o QR Code com o app do seu banco:</p>
                            <div className="flex justify-center my-4">
                                <img src={qrCodeUrl} alt="PIX QR Code" className="bg-white p-2 rounded-lg" />
                            </div>
                            <p className="mb-2">Ou use a chave PIX (copia e cola):</p>
                            <div className="bg-medium-gray p-3 rounded-lg flex justify-between items-center">
                                <span className="font-mono text-gray-300 truncate">{paymentSettings.pixKey}</span>
                                <button onClick={() => navigator.clipboard.writeText(paymentSettings.pixKey)} className="ml-4 text-sm bg-neon-blue text-black font-bold py-1 px-3 rounded">Copiar</button>
                            </div>
                        </>
                    ) : (
                        <p className="text-yellow-400 bg-yellow-900/50 p-4 rounded-lg">O administrador ainda não configurou uma chave PIX. Por favor, entre em contato.</p>
                    )}
                </div>
            )}

             {(paymentMethod === 'card' || paymentMethod === 'debit') && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">{paymentMethod === 'card' ? 'Cartão de Crédito' : 'Cartão de Débito'}</h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Número do Cartão" className="w-full bg-medium-gray p-3 rounded" />
                        <input type="text" placeholder="Nome no Cartão" className="w-full bg-medium-gray p-3 rounded" />
                        <div className="flex gap-4">
                           <input type="text" placeholder="Validade (MM/AA)" className="w-1/2 bg-medium-gray p-3 rounded" />
                           <input type="text" placeholder="CVV" className="w-1/2 bg-medium-gray p-3 rounded" />
                        </div>
                    </div>
                </div>
            )}
            
            {paymentMethod === 'boleto' && (
                 <div className="text-center">
                     <h3 className="text-xl font-semibold mb-4">Boleto Bancário</h3>
                     <p>Um boleto simulado seria gerado aqui.</p>
                     <div className="my-4 p-4 border-2 border-dashed border-gray-600 rounded-lg">
                         <p className="font-mono">00190.00009 02458.123457 12345.678901 1 92340000123456</p>
                     </div>
                 </div>
            )}

            <div className="mt-8">
                 {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                 <button 
                     onClick={handlePaymentConfirmation}
                     disabled={isLoading || (paymentMethod === 'pix' && !paymentSettings.pixKey)}
                     className="w-full bg-neon-yellow text-black font-bold py-3 px-4 rounded-md hover:bg-yellow-300 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                 >
                     {isLoading ? 'Confirmando...' : 'Confirmar Pedido e Pagamento'}
                 </button>
            </div>
         </div>
    );

    return (
        <div>
            {step === 'details' ? renderDetailsStep() : renderPaymentStep()}
        </div>
    );
};

export default CheckoutView;
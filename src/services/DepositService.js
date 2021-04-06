import axios from 'axios';
import router from '@/router';

export const getDepositAddress = async account => {
    let response;
    try {
        response = await axios.get(
            `https://cryptoanchor.io/stellar/deposit?asset_code=BTC&account=${account}`,
            {}
        );
        if (response.status !== 200) {
            await router.push({
                name: 'error screen',
                params: {
                    reason: 'Api failed',
                    fix:
                        'Please refresh, if error persists, please contact support?',
                },
            });
            return;
        }
        return response.data.how;
    } catch (e) {
        await router.push({
            name: 'error screen',
            params: {
                reason: 'Api failed',
                fix:
                    'Please refresh, if error persists, please contact support?',
            },
        });
    }
};

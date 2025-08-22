export const OrderStatuses = {
    ACTIVE: {
        id: 1,
        name: 'Aktif',
        value: 'ACTIVE'
    },
    PREPARING: {
        id: 2,
        name: 'Hazırlanıyor',
        value: 'PREPARING'
    },
    CANCELLED: {
        id: 3,
        name: 'İptal',
        value: 'CANCELLED'
    },
    SHIPPED: {
        id: 4,
        name: 'Kargolandı',
        value: 'SHIPPED'
    },
    DELIVERED: {
        id: 5,
        name: 'Teslim Alındı',
        value: 'DELIVERED'
    }
};

// Status ID'lerine göre hızlı erişim için
export const OrderStatusById = {
    1: OrderStatuses.ACTIVE,
    2: OrderStatuses.PREPARING,
    3: OrderStatuses.CANCELLED,
    4: OrderStatuses.SHIPPED,
    5: OrderStatuses.DELIVERED
};

// Status value'larına göre hızlı erişim için
export const OrderStatusByValue = {
    'ACTIVE': OrderStatuses.ACTIVE,
    'PREPARING': OrderStatuses.PREPARING,
    'CANCELLED': OrderStatuses.CANCELLED,
    'SHIPPED': OrderStatuses.SHIPPED,
    'DELIVERED': OrderStatuses.DELIVERED
};

// Tüm status'ları array olarak almak için
export const OrderStatusList = Object.values(OrderStatuses);

// Status'a göre renk belirleme
export const getOrderStatusColor = (statusId) => {
    switch (statusId) {
        case 1: // Aktif
            return 'bg-green-100 text-green-800';
        case 2: // Hazırlanıyor
            return 'bg-yellow-100 text-yellow-800';
        case 3: // İptal
            return 'bg-red-100 text-red-800';
        case 4: // Kargolandı
            return 'bg-blue-100 text-blue-800';
        case 5: // Teslim Alındı
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Status'a göre icon belirleme - React import gerektirir
export const getOrderStatusIcon = (statusId) => {
    switch (statusId) {
        case 1: // Aktif
            return 'check-circle';
        case 2: // Hazırlanıyor
            return 'clock';
        case 3: // İptal
            return 'x-circle';
        case 4: // Kargolandı
            return 'truck';
        case 5: // Teslim Alındı
            return 'check';
        default:
            return 'question-mark-circle';
    }
};

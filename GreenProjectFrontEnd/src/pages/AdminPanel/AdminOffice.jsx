import React from 'react';
import {Link} from 'react-router-dom';

const AdminOffice = () => {
    return (
        <div>
            <h3>AdminPanel</h3>
            <Link to="/addProductToStore">Ürün Ekle</Link>
        </div>
    );
};

export default AdminOffice;
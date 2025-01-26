import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';

export default function BodyComponent() {
    return (
        <div className="body-container">
            <HeaderComponent />
            <Outlet />
        </div>
    );
}

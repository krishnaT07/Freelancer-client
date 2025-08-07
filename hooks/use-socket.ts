
'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    // client side (use-socket.ts)
const socket = io('http://localhost:4000');


    useEffect(() => {
        if (socketRef.current) return;

        // Initialize the socket connection to the same host
        const socket = io({
            path: '/api/socket',
            addTrailingSlash: false,
        });
        socketRef.current = socket;

        const onConnect = () => {
            console.log('Socket connected');
            setIsConnected(true);
        };

        const onDisconnect = () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // Cleanup on component unmount
        return () => {
            console.log('Disconnecting socket...');
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return { socket: socketRef.current, isConnected };
};

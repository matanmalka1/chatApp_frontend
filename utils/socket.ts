
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants';

class SocketManager {
  private static instance: Socket | null = null;

  public static getInstance(token: string | null): Socket {
    if (!token) {
      if (this.instance) {
        this.instance.disconnect();
        this.instance = null;
      }
      return null as any;
    }

    if (!this.instance) {
      this.instance = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      // Fix: cast auth to any to access token property as socket.io-client types auth as either an object or a function
    } else if ((this.instance.auth as any).token !== token) {
      this.instance.disconnect();
      this.instance = io(SOCKET_URL, {
        auth: { token },
      });
    }

    return this.instance;
  }

  public static disconnect() {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
    }
  }
}

export default SocketManager;

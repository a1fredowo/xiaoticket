import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComprarReventaPage from './page';

// Mock components con rutas relativas
jest.mock('../../../components/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('../../../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock window.alert
global.alert = jest.fn();

// Mock fetch
global.fetch = jest.fn();

const mockPublicaciones = [
  {
    _id: '507f1f77bcf86cd799439011',
    eventName: 'Concierto Rock',
    eventDate: '2024-12-31',
    eventTime: '21:00',
    eventLocation: 'Estadio Nacional',
    packageType: 'VIP',
    sellerName: 'Juan Pérez',
    price: 50000,
    quantity: 5,
  },
  {
    _id: '507f1f77bcf86cd799439012',
    eventName: 'Festival Jazz',
    eventDate: '2024-11-15',
    eventTime: '19:30',
    eventLocation: 'Teatro Municipal',
    packageType: 'General',
    sellerName: 'María García',
    price: 25000,
    quantity: 0,
  },
];

describe('ComprarReventaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  describe('Component Rendering', () => {
    it('renders without crashing', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ publicaciones: [] }),
      });

      render(<ComprarReventaPage />);
      
      expect(screen.getByText('Comprar Tickets de Reventa')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      render(<ComprarReventaPage />);
      
      expect(screen.getByText('Cargando publicaciones...')).toBeInTheDocument();
    });

    it('shows no tickets message when empty', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ publicaciones: [] }),
      });

      render(<ComprarReventaPage />);
      
      await waitFor(() => {
        expect(screen.getByText('No hay tickets en reventa actualmente.')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    it('fetches publicaciones on mount', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ publicaciones: mockPublicaciones }),
      });

      render(<ComprarReventaPage />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/reventa');
      });
    });

    it('displays fetched publicaciones correctly', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ publicaciones: mockPublicaciones }),
      });

      render(<ComprarReventaPage />);

      await waitFor(() => {
        expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
        expect(screen.getByText('Festival Jazz')).toBeInTheDocument();
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      });
    });
  });

  describe('handleBuy Function', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ publicaciones: mockPublicaciones }),
        });

      render(<ComprarReventaPage />);

      await waitFor(() => {
        expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
      });

      jest.clearAllMocks();
    });

    it('shows alert when no token is present', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const buyButtons = screen.getAllByText('Comprar');
      fireEvent.click(buyButtons[0]);

      expect(alert).toHaveBeenCalledWith('Debes iniciar sesión');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('makes API call with correct parameters when buying', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const buyButtons = screen.getAllByText('Comprar');
      fireEvent.click(buyButtons[0]);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/reventa/comprar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid-token',
          },
          body: JSON.stringify({
            reventaId: '507f1f77bcf86cd799439011',
            quantity: 1,
          }),
        });
      });
    });

    it('shows success alert and updates state on successful purchase', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const buyButtons = screen.getAllByText('Comprar');
      fireEvent.click(buyButtons[0]);

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('¡Compra realizada!');
      });
    });

    it('handles API error response', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'No hay suficiente cantidad disponible' }),
      });

      const buyButtons = screen.getAllByText('Comprar');
      fireEvent.click(buyButtons[0]);

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('No hay suficiente cantidad disponible');
      });
    });

    it('handles quantity input changes', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ publicaciones: mockPublicaciones }),
      });

      render(<ComprarReventaPage />);

      await waitFor(() => {
        expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
      });

      const quantityInput = screen.getAllByDisplayValue('1')[0];
      fireEvent.change(quantityInput, { target: { value: '3' } });

      expect(quantityInput).toHaveValue(3);
    });

    it('disables buy button when quantity is 0', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ publicaciones: mockPublicaciones }),
      });

      render(<ComprarReventaPage />);

      await waitFor(() => {
        const buyButtons = screen.getAllByText('Comprar');
        // El segundo botón debería estar deshabilitado porque quantity es 0
        expect(buyButtons[1]).toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles fetch error on initial load', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ComprarReventaPage />);

      await waitFor(() => {
        expect(screen.getByText('No hay tickets en reventa actualmente.')).toBeInTheDocument();
      });
    });

    it('handles network error during purchase', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ publicaciones: mockPublicaciones }),
        })
        .mockRejectedValueOnce(new Error('Network error'));

      render(<ComprarReventaPage />);

      await waitFor(() => {
        expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
      });

      const buyButtons = screen.getAllByText('Comprar');
      fireEvent.click(buyButtons[0]);

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Error de conexión. Intenta nuevamente.');
      });
    });
  });
});
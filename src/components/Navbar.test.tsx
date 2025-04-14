import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from './Navbar';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

vi.mock('../assets/favorite.svg', () => ({ default: 'mocked-favorite.svg' }));
vi.mock('../assets/burger.svg', () => ({ default: 'mocked-burger.svg' }));
vi.mock('../assets/search.svg', () => ({ default: 'mocked-search.svg' }));
vi.mock('../assets/sun.svg', () => ({ default: 'mocked-sun.svg' }));
vi.mock('../assets/moon.svg', () => ({ default: 'mocked-moon.svg' }));

export const mockToggle = vi.fn();

vi.mock('../hooks/useDarkMode', () => {
    return {
        useDarkMode: vi.fn(() => [false, mockToggle]),
    };
});

// Creamos un mock para useNavigate y lo exportamos para verificarlo luego
const mockNavigate = vi.fn();

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>(
        'react-router-dom'
    );

    return {
        ...actual,
        useParams: vi.fn(() => ({ category: 'general' })),
        useNavigate: () => mockNavigate,
        NavLink: vi.fn(
            ({
                to,
                children,
                className,
                onClick,
            }: {
                to: string;
                children: ReactNode;
                className:
                    | string
                    | (({ isActive }: { isActive: boolean }) => undefined);
                onClick: () => void;
            }) => (
                <a
                    href={to}
                    className={
                        typeof className === 'function'
                            ? className({ isActive: false })
                            : className
                    }
                    data-testid={`link-${to}`}
                    onClick={(e) => {
                        e.preventDefault(); // Prevenir navegación real
                        if (onClick) onClick(); // Simular click handler
                        mockNavigate(to); // Simular navegación
                    }}
                >
                    {children}
                </a>
            )
        ),
    };
});

describe('Navbar', () => {
    beforeEach(() => {
        mockToggle.mockClear();
    });

    it('renderiza correctamente', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        expect(screen.getByText(/Musk/)).toBeInTheDocument();
        expect(screen.getByText(/News/)).toBeInTheDocument();
    });

    it('activa el cambio de tema al hacer clic', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        const toggleBtn = screen.getByTitle('switch theme');
        fireEvent.click(toggleBtn);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('debe navegar a la categoría "General" al hacer clic en el enlace', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        // Buscar el enlace "General"
        const generalLink = screen.getByText('General');

        // Simular clic
        fireEvent.click(generalLink);

        // Verificar que se haya llamado a navigate con la ruta correcta
        expect(mockNavigate).toHaveBeenCalledWith('/category/general');
    });

    it('snapshot', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

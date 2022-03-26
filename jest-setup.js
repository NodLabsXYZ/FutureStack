import '@testing-library/jest-dom'

jest.mock('react-markdown', () => ({}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => {}
}));

jest.mock('@bundlr-network/client', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({}))
}));
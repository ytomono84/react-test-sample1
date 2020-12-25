import { render, act, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';
import Search from './App'
import React from "react";

describe('App', () => {
  it('renders app component within text', () => {
    render(<App />);
    expect(screen.getByText("Search:")).toBeInTheDocument();

  });

  it('renders app component within textbox', () => {
    render(<App />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('does not render app component with non-exist text', () => {
    render(<App />);

    // fails
    // expect(screen.getByText('Searches for JavaScript/')).toBeNull();

    // success
    expect(screen.queryByText('Searches for JavaScript/')).toBeNull();
  });

  it( 'renders app asynchronous component', async () => {
    render(<App />);

    expect(screen.queryByText(/Signed in as/)).toBeNull();

    //screen.debug();

    expect(await screen.findByText(/Signed in as/)).toBeInTheDocument();

    //screen.debug();
  });

  it ('renders app component on fire event', async () => {
    render(<App />);

    // wait for the user to resolve
    // needs only be used in our special case
    await screen.findByText(/Signed in as/);

    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    //screen.debug();

    fireEvent.change(screen.getByRole('textbox'),{
      target: { value: 'JavaScript'},
    });

    //screen.debug();
  });

  it ('renders app component on fire user event', async () =>{
    render(<App />);

    // wait for the user to resolve
    await screen.findByText(/Signed in as/);

    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    await userEvent.type(screen.getByRole('textbox'), 'JavaScript');

    expect(
      screen.getByText(/Searches for JavaScript/)
    ).toBeInTheDocument();
  });
});

describe('Search', () => {
  it ('calls the onChange callback handler with fire event', () => {
    const onChange = jest.fn().mockName('mockEventHandler');

    // I don't understand behavior component render with using hooks
    const container =  render(
      <Search value="" onChange={onChange}>
        Search:
      </Search>
    );

    container.debug();

    fireEvent.change(container.getByRole('textbox'), {
      target: { value: 'JavaScript'}
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it( 'calls the onChange callback handler with user event', async () => {
    const onChange = jest.fn();

    // I don't understand behavior component render with using hooks
    const container = render(
      <Search value="" onChange={onChange}>
        Search:
      </Search>
    );

    await userEvent.type(container.getByRole('textbox'), 'JavaScript');

    expect(onChange).toHaveBeenCalledTimes(10);
  });

});
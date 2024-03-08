import { useState } from 'react';
import { Header, Button, Input, Search, Form } from './Searchbar.styled';
function Searchbar({ updateName }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    updateName(inputValue.toLowerCase().trim());
    setInputValue('');
  };
  return (
    <Header>
      <Form className="form" onSubmit={handleSubmit}>
        <Button type="submit">
          <Search />
        </Button>
        <Input
          type="text"
          autoComplete="off"
          autoFocus
          value={inputValue}
          placeholder="Search images and photos"
          name="search"
          onChange={handleInputChange}
        />
      </Form>
    </Header>
  );
}

export default Searchbar;

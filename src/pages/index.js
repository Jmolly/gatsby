import * as React from 'react';

// styles
const pageStyles = {
  color: '#232129',
  padding: '30px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

// markup
const IndexPage = () => {
  const handleClick = async (e) => {
    e.preventDefault();
    console.log(e.target.value, 'value');
    console.log('click 1344');
    try {
      const res = await fetch('/.netlify/functions/newsletter-signed-up', {
        email: 'test3@gmail.com',
        location: 'by',
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main style={pageStyles}>
      <form onSubmit={handleClick}>
        <p>
          Stay tuned in as we discover more of this mysterious world. New
          products and stories every week.
        </p>
        <input />
        <button>sign me up</button>
      </form>
    </main>
  );
};

export default IndexPage;

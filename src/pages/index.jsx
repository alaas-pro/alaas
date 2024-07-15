import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const IndexPage = ({ data }) => {
  const allPosts = data.allMarkdownRemark.edges;
  const [filteredPosts, setFilteredPosts] = useState(allPosts);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(allPosts.flatMap(post => post.node.frontmatter.categories)));
    const uniqueTags = Array.from(new Set(allPosts.flatMap(post => post.node.frontmatter.tags)));
    setCategories(uniqueCategories);
    setTags(uniqueTags);
  }, [allPosts]);

  const handleFilter = (filter, type) => {
    if (type === 'category') {
      setFilteredPosts(allPosts.filter(post => post.node.frontmatter.categories.includes(filter)));
    } else if (type === 'tag') {
      setFilteredPosts(allPosts.filter(post => post.node.frontmatter.tags.includes(filter)));
    } else {
      setFilteredPosts(allPosts);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredPosts(allPosts.filter(post =>
      post.node.frontmatter.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      post.node.frontmatter.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
      post.node.frontmatter.tags.join(' ').toLowerCase().includes(e.target.value.toLowerCase()) ||
      post.node.html.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  return (
    <Layout>
      <h1>Blog Posts</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div>
        <h2>Categories</h2>
        <button onClick={() => handleFilter('All', 'category')}>All</button>
        {categories.map(category => (
          <button key={category} onClick={() => handleFilter(category, 'category')}>{category}</button>
        ))}
      </div>
      <div>
        <h2>Tags</h2>
        <button onClick={() => handleFilter('All', 'tag')}>All</button>
        {tags.map(tag => (
          <button key={tag} onClick={() => handleFilter(tag, 'tag')}>{tag}</button>
        ))}
      </div>
      <ul>
        {filteredPosts.map(({ node }) => (
          <li key={node.fields.slug}>
            <a href={node.fields.slug}>{node.frontmatter.title}</a>
            <p>{node.frontmatter.description}</p>
            <p>{node.frontmatter.categories.join(', ')}</p>
            <p>{node.frontmatter.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            description
            date
            categories
            tags
          }
          fields {
            slug
          }
          html
        }
      }
    }
  }
`;

export default IndexPage;

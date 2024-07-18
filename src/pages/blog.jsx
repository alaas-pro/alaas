import { graphql } from 'gatsby';
import React, { useState, useEffect } from 'react';

import BlogPosts from '../components/blog-posts';
import Header from '../components/header';
import Layout from '../components/layout';
import SEO from '../components/seo';
import NotFound from '../pages/404';

const BlogPage = ({ data }) => {
  const allPosts = data.allMarkdownRemark.edges;
  const [filteredPosts, setFilteredPosts] = useState(allPosts);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const noBlog = !allPosts || !allPosts.length;

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(allPosts.flatMap(post => post.node.frontmatter.categories || [])));
    setCategories(uniqueCategories);
  }, [allPosts]);

  const handleFilter = (filter) => {
    if (filter === 'All') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(allPosts.filter(post => post.node.frontmatter.categories.includes(filter)));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredPosts(allPosts.filter(post =>
      post.node.frontmatter.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      post.node.frontmatter.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
      post.node.html.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  if (noBlog) {
    return <NotFound />;
  }

  return (
    <Layout>
      <SEO title="Blog" />
      <Header metadata={data.site.siteMetadata} />
      <div>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div>
          <h2>Categories</h2>
          <button onClick={() => handleFilter('All')}>All</button>
          {categories.map(category => (
            <button key={category} onClick={() => handleFilter(category)}>{category}</button>
          ))}
        </div>
      </div>
      {!noBlog && <BlogPosts posts={filteredPosts} />}
    </Layout>
  );
};

export default BlogPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        name
        title
        description
        about
        medium
        github
        linkedin
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            categories
          }
          html
        }
      }
    }
  }
`;

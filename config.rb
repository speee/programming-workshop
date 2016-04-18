###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml',  layout: false
page '/*.json', layout: false
page '/*.txt',  layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration
set :slim, pretty: true, sort_attrs: false, format: :html
activate :directory_indexes

activate :external_pipeline,
  name: :gulp,
  command: "./node_modules/gulp/bin/gulp.js #{build? ? :build : :watch}",
  source: 'frontend-dist',
  latency: 1

# Reload the browser automatically whenever files change
configure :development do
end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

# Build-specific configuration
configure :build do
  activate :minify_css
  activate :minify_javascript
  set :http_prefix, '/programming-workshop'
end

activate :deploy do |deploy|
  deploy.deploy_method  = :git
  deploy.build_before   = true
  deploy.branch         = 'gh-pages'
  deploy.commit_message = 'Automated deployment by CircleCI [ci skip]'
end


gen: ## test tweet
	@echo "Update vaccine files..."
	npm run tocsv
	npm run tojson

gen-test: ## test tweet
	@echo "Update vaccine files..."
	npm run tocsv
	npm run tojson
	@echo "Testing tweet..."
	npm run testTweet

dylan: ## test tweet
	@echo "Update Dylan files..."
	npm run streamcsv
	npm run data2json

test-tweet: ## test tweet
	@echo "Testing tweet..."
	npm run testTweet

tweet: ## test tweet
	@echo "Tweeting..."
	npm run build
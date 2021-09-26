
gen: ## test tweet
	@echo "Update vaccine files..."
	npm run fetch
	npm run update
	npm run tocsv

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
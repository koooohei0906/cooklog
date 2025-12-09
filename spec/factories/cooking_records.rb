FactoryBot.define do
  factory :cooking_record do
    user { nil }
    cooked_on { "2025-12-09" }
    dish_name { "MyString" }
    recipe_url { "MyText" }
    memo { "MyString" }
  end
end

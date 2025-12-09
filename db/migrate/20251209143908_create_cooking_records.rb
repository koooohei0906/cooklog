class CreateCookingRecords < ActiveRecord::Migration[7.2]
  def change
    create_table :cooking_records do |t|
      t.references :user, null: false, foreign_key: true
      t.date :cooked_on
      t.string :dish_name
      t.text :recipe_url
      t.string :memo

      t.timestamps
    end
  end
end

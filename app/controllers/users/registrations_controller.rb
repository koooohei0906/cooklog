class Users::RegistrationsController < Devise::RegistrationsController
  before_action :check_guest, only: %i[ destroy update ]

  # ゲストアカウントの編集/削除対策
  def check_guest
    if resource.email == "guest@example.com"
      redirect_to dashboard_path, alart: "ゲストユーザーは編集・削除できません"
    end
  end

  # プロフィール更新の際、パスワードを設定していないGoogleログインユーザーにはパスワードを求めないようにする
  # DeviseのresourceはUserとかを示す汎用名
  def update_resource(resource, params)
    return super if params["password"].present?

    resource.update_without_password(params.except("current_password"))
  end
end

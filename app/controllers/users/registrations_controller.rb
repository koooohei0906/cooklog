class Users::RegistrationsController < Devise::RegistrationsController
  # プロフィール更新の際、パスワードを設定していないGoogleログインユーザーにはパスワードを求めないようにする
  # DeviseのresourceはUserとかを示す汎用名
  def update_resource(resource, params)
    return super if params['password'].present?
  
    resource.update_without_password(params.except('current_password'))
  end
end

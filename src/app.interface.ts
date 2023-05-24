export interface UserData {
  uid: string
  email: string
  phone: string
  isAdmin: boolean
  role: string
  expire_th: string
}

export interface UserRequest extends Request {
  user?: UserData
}

export interface insertUser {
  uid: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  birth_date: string;
  sex: string;
  role: string; 
}

export interface insertScore {
  knowledge: number,
  benefit: number,
  teaching: number,
  teacher: number,
  satisfaction: number,
  score: number,
  user_id: string,
  course_id: string
}


export interface insertCourse { 
  id: string,
  name_th: string,
  name_en: string,
  discription: string
}
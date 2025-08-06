import type {Stack} from "@/app/model/stack"
export type WorkMode='ONLINE'|'OFFLINE'|'BOTH';

export type Post= {
	postId: number;
	userId: string;
	title: string;
	content:string;
	status:boolean;
	workMode:WorkMode;
	stacks:Stack[];
	endDate:string;
	capacity:number;
	positions:string[];
	createdAt: Date;
	updatedAt:Date;
};
export type User={
	userId:string;
	nickName:string;
	description:string;
	location:string;
	image:string;
	github:string;
	workMode:WorkMode;
	beginner:string;
	isPublic:boolean;
	stacks:Stack[];
	createdAt: Date;
	updatedAt:Date;
	positionId:number;
	posts:  Post[]
	comments:Comment[]
	notices:  Notice[]
}
export type Notice={
	noticeId: string;
	userId: string;
	isRead: boolean;
	message: string
	createdAt :Date;
}
export type Board='teammate'|'team';
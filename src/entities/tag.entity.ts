import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity.js';

@Entity('tag')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    name: string;

    @ManyToMany(() => Article, (article) => article.tags)
    articles: Article[];

}

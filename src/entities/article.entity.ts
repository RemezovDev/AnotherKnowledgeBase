import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from './tag.entity.js';

@Entity('article')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    title: string;

    @Column()
    content: string;

    @Column({name: 'is_public', default: false})
    isPublic: boolean;

    @ManyToMany(() => Tag, (tag) => tag.articles)
    @JoinTable()
    tags: Tag[];
}

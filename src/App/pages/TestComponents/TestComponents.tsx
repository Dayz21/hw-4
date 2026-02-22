import { Loader } from "@components/Loader"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button/Button"
import { Input } from "@/components/Input"
import { useState } from "react"
import { FavoritesIcon } from "@/components/Icons/FavoritesIcon"
import { ArrowRightIcon } from "@/components/Icons/ArrowRightIcon"
import { CheckIcon } from "@/components/Icons/CheckIcon"
import { StarIcon } from "@/components/Icons/StarIcon"
import { AccountIcon } from "@/components/Icons/AccountIcon"
import { CheckBox } from "@/components/CheckBox"
import { Card } from "@/components/Card"
import { MultiDropdown } from "@/components/MultiDropdown"
import type { Option } from "@/components/MultiDropdown/MultiDropdown"

export const TestComponents = () => {
    const [inputValue, setInputValue] = useState("");
    const [checkboxValue, setCheckboxValue] = useState(true);
    const [dropdownValue, setDropdownValue] = useState<Option[]>([]);
    const options: Option[] = [
        {key: "1", value: "Option 1"},
        {key: "2", value: "Option 2"},
        {key: "3", value: "Option 3"},
        {key: "4", value: "Option 4"},
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "400px", margin: "0 auto", padding: 16 }}>
            <div>
                <Loader size="l" />
                <Loader size="m" />
                <Loader size="s" />
            </div>

            <Text view="title" tag="h1">Title</Text>
            <Text view="subtitle" tag="h2">Subtitle</Text>
            <Text view="button" tag="span">Button</Text>
            <Text view="p-20" tag="div" color="secondary">Paragraph 20</Text>
            <Text view="p-18" tag="div" weight="bold" color="accent">Paragraph 18</Text>
            <Text view="p-16" tag="div" weight="medium">Paragraph 16</Text>
            <Text view="p-14" tag="div" maxLines={2}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis pariatur aspernatur quasi temporibus ipsam? Omnis quisquam aliquid maxime libero repellat commodi necessitatibus voluptatem voluptatibus. Magnam veritatis vitae blanditiis natus minus laboriosam corporis sunt quod eos officia numquam velit libero aliquid repellendus itaque, quis sequi, ducimus quibusdam autem. Id itaque nesciunt blanditiis excepturi alias labore accusantium voluptate? Sequi dolores sint, sunt aliquam laboriosam alias commodi dicta eum sed, quaerat distinctio atque molestiae libero. Modi libero minus aliquid deserunt eum harum quos ex, unde, incidunt consequatur voluptatum voluptate aut sit voluptatibus, earum est. Laboriosam neque consectetur quas fugiat asperiores rem. Eveniet, ullam.</Text>
        
            <Button onClick={() => {}}>Текст кнопки</Button>
            <Button onClick={() => {}} loading>Текст кнопки</Button>
            <Button onClick={() => {}} outlined>Текст кнопки</Button>
            <Button onClick={() => {}} loading outlined>Текст кнопки</Button>

            <MultiDropdown
                getTitle={(value) => value.length > 0 ? value.map(el => el.value).join(", ") : "Выберите опции"}
                options={options}
                value={dropdownValue}
                onChange={setDropdownValue}
            />  

            <Input value={inputValue} onChange={setInputValue} placeholder="Какой-то текст" />
            <Input value={inputValue} onChange={setInputValue} placeholder="Какой-то текст с иконкой" afterSlot={<ArrowRightIcon angle={90} size={24} />} />
            <Input value={inputValue} onChange={setInputValue} placeholder="Какой-то текст" disabled />

            <div style={{display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
                <CheckIcon color="secondary" />
                <ArrowRightIcon color="accent" />
                <StarIcon color="original" angle={30} />
                <FavoritesIcon color="primary" angle={150} />
                <AccountIcon color="primary" />
            </div>

            <div style={{display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
                <CheckBox checked={checkboxValue} onChange={(checked) => setCheckboxValue(checked)} size={30} />
                <CheckBox checked={false} onChange={(checked) => console.log(checked)} />
                <CheckBox checked={true} onChange={(checked) => console.log(checked)} disabled />
                <CheckBox checked={false} onChange={(checked) => console.log(checked)} disabled />
            </div>

            <Card
                title="Заголовок карточки"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                imageUrl="https://www.mobile-review.com/articles/2014/image/breaking-bad/1.jpg"
                genre="Жанр"
                releaseYear={2023}
                ageRating={16}
                rating={8.5}
                timing={125}
            >
                <Button onClick={() => {}} outlined>В избранное</Button>
                <Button onClick={() => {}}>Смотреть</Button>
            </Card>
        </div>
    )
}
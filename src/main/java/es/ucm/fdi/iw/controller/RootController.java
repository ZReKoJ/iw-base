package es.ucm.fdi.iw.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Code;
import es.ucm.fdi.iw.model.Map;
import es.ucm.fdi.iw.model.User;

@Controller	
public class RootController{

	private static Logger log = Logger.getLogger(RootController.class);
	
	@Autowired
	private LocalData localData;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EntityManager entityManager;
	
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "/static");
    }
    
    @RequestMapping(value = "/createUser", method = RequestMethod.POST)
	@Transactional
	public String createUser(
			@RequestParam String nickname, 
			@RequestParam String password) 
    {
    	
		User u = new User();
		u.setNickname(nickname);
		u.setPassword(passwordEncoder.encode(password));
		u.setWin(0);
		u.setDraw(0);
		u.setLose(0);
		u.setEnabled((byte) 0x01);
		u.setRoles("USER");
		
		entityManager.persist(u);
		entityManager.flush();
		
		return "login";
	}
    
    @RequestMapping(value = "/createCode", method=RequestMethod.POST)
    @Transactional
    public String handleCreateCode(
    		HttpServletResponse response,
    		@RequestParam String code,
    		@RequestParam String codeFileName,
    		HttpSession s)
    {
    	response.setHeader("X-XSS-Protection", "0");
    	
		String error = "";
        if (code.isEmpty()) {
        	error = "You failed to upload a photo for " 
                + codeFileName + " because the file was empty.";     
        	log.info(error);
        } else {
        	
	    		Code codeObject= new Code();
	    		User u = (User)s.getAttribute("user");
	    		codeObject.setCreator(u);
	    		codeObject.setDescription("");
	    		codeObject.setName(codeFileName);
	    		codeObject.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(codeObject);
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("codes", String.valueOf(codeObject.getId()));
	    		try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f)))
	    		{
	    			stream.write(code.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + codeFileName + " => " + e.getMessage();
	    		}
	  
	            return "/code-design";
	            
        }
        // exit with error, blame user
    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return error;
	}
    
    @RequestMapping(value="/createMap", method=RequestMethod.POST)
    @Transactional
    public String handleCreateMap(
    		HttpServletResponse response,
    		@RequestParam String json,
    		@RequestParam String mapFileName,
    		HttpSession s)
    {

    	String error = "";
        if (json.isEmpty()) {
        	error = "You failed to upload the map";     
        	log.info(error);
        } else {
        	
	    		Map map= new Map();
	    		User u = (User)s.getAttribute("user");
	    		map.setCreator(u);
	    		map.setName(mapFileName);
	    		map.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(map);
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("maps", String.valueOf(map.getId()));
	    		try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f)))
	    		{
	    			stream.write(json.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + "pruebaCanvas.png" + " => " + e.getMessage();
	    		}
	    		 return "/settings";
        }
      
     // exit with error, blame user
    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return error;
       
	}
    
	@GetMapping({"/", "/index"})
	public String root(Model model, Principal principal, HttpSession s) {
		
		if (s.getAttribute("user") == null) {
			s.setAttribute("user", entityManager
					.createQuery("from User where nickname = :nickname", User.class)
					.setParameter("nickname", principal.getName())
	                .getSingleResult());
				
		}
		
		return "home";
	}
	
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}

	@GetMapping("/chat")
	public String chat(Model model, HttpServletRequest request) {
		model.addAttribute("endpoint", request.getRequestURL().toString()
				.replaceFirst("[^:]*", "ws")
				.replace("chat", "chatsocket"));
		return "chat";
	}	
	
	@GetMapping("/logout")
	public String logout() {
		return "logout";
	}
	
	@GetMapping("/upload")
	public String upload() {
		return "upload";
	}
	
	@GetMapping("/results")
	public String results() {
		return "results";
	}
	
	@GetMapping("/playing")
	public String playing() {
		return "playing";
	}
	
	@GetMapping("/loadPlaying")
	public String loadPlay(
			@RequestParam String usercode,
			@RequestParam String map,
			@RequestParam String enemycodes[],
			Model m) {
		
		m.addAttribute("usercode", usercode);
		m.addAttribute("map", map);
		m.addAttribute("enemycodes", enemycodes);
		
		return "playing";
	}
	
	@GetMapping("/map-design")
	public String map_design(@RequestParam(required=false) String id,
			Model m) {
		if (id != null && !id.isEmpty())
			m.addAttribute("mapId", id);
		return "map-design";
	}
	
	@GetMapping("/code-design")
	public String code_design(@RequestParam(required=false) String id,
			Model m) {
		if (id != null && !id.isEmpty())
			m.addAttribute("codeId", id);
		return "code-design";
	}
	
	@GetMapping("/play")
	public String play(Model m, HttpSession s) {
		
		List<Map> maps = entityManager.createQuery("from Map", Map.class).getResultList();
		m.addAttribute("maps", maps);
		
		List<Code> codes = entityManager.createQuery("from Code", Code.class).getResultList();
		m.addAttribute("codes", codes);
		
		User u = (User) s.getAttribute("user");
		m.addAttribute("ownedCodes", entityManager
						.createQuery("from Code where creator = :id", Code.class)
			            .setParameter("id",  u).getResultList());
			
		return "play";
	}
	
	@GetMapping("/profile")

	public String profile(HttpSession s, Model m) {
		
		User u = (User) s.getAttribute("user");
		List<Code> myCodes = entityManager
				.createQuery("from Code where creator = :nickname", Code.class)
				.setParameter("nickname", u)
                .getResultList();
		List<Map> myMaps = entityManager
				.createQuery("from Map where creator = :nickname", Map.class)
				.setParameter("nickname", u)
                .getResultList();
		
		m.addAttribute("myCodes", myCodes);
		m.addAttribute("myMaps", myMaps);
		m.addAttribute("myCodesSize", myCodes.size());
		m.addAttribute("myMapsSize", myMaps.size());
		
		return "profile";
	}
	
	@GetMapping("/settings")
	public String settings() {
		return "settings";
	}
	
	@GetMapping("/ranking")
	public String ranking(Model m) {
		
		List<User> users = entityManager.createQuery("from User", User.class).getResultList();
		users = users.stream().sorted((user1, user2) -> new Integer(user2.getScore()).compareTo(new Integer(user1.getScore()))).collect(Collectors.toList());
		m.addAttribute("users", users);
	
		return "ranking";
	}
	
	@GetMapping("/loadMap/{id}")
	public String loadMap(@PathVariable("id") String id, 
			HttpServletRequest request, 
			HttpServletResponse response) 
	throws ServletException, IOException
	{
		
		BufferedReader br = new BufferedReader(new FileReader(localData.getFile("maps", id)));
		String everything = "";
		try {
		    StringBuilder sb = new StringBuilder();
		    String line = br.readLine();

		    while (line != null) {
		        sb.append(line);
		        sb.append(System.lineSeparator());
		        line = br.readLine();
		    }
		    everything = sb.toString();
		} finally {
		    br.close();
		}
		
		
	    response.setContentType("application/json");
	    PrintWriter info = response.getWriter();
	    info.println(everything);
	    info.close();
	    return "playing";
	}
	
	@GetMapping("/loadCode/{id}")
	public String loadCode(@PathVariable("id") String id, 
			HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException  

	// request is an object of type HttpServletRequest and it's used to obtain information
	// response is an object of type HttpServletResponse and it's used to generate a response
	// throws is used to specify the exceptions than a method can throw
	
	 {
		BufferedReader br = new BufferedReader(new FileReader(localData.getFile("codes", id)));
		String everything = "";
		try {
		    StringBuilder sb = new StringBuilder();
		    String line = br.readLine();

		    while (line != null) {
		        sb.append(line);
		        sb.append(System.lineSeparator());
		        line = br.readLine();
		    }
		    everything = sb.toString();
		} finally {
		    br.close();
		}
		
		
	    response.setContentType("text/plain");
	    PrintWriter info = response.getWriter();
	    info.println(everything);
	    info.close();
	    return "playing";
	 }
	
	@RequestMapping(value="/saveAvatar", method=RequestMethod.POST)
	public String handleFileUpload(
			@RequestParam MultipartFile photo, 
			HttpSession s)
	{
		String error = "";
		if (photo.isEmpty()) {
			error = "Empty file uploading photo";
			log.error(error);
		} else {
			String id = "" + ((User)s.getAttribute("user")).getId();
			File f = localData.getFile("users/" + id,"avatar");
			try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f))) {
				stream.write(photo.getBytes());
			} catch (Exception e) {
				error = "Upload failed " + s.getAttribute("user").toString() + " => " + e.getMessage();
				log.error(error);
			}
		}

		    return  "redirect:/profile";
	}
	

	@RequestMapping(value="/avatar/{id}", 		
			produces = MediaType.IMAGE_JPEG_VALUE)
	public void userPhoto(@PathVariable("id") String id, 
			HttpServletResponse response) {
	    File f = localData.getFile("users/" + id, "avatar");
	    try (InputStream in = f.exists() ? 
		    	new BufferedInputStream(new FileInputStream(f)) :
		    	new BufferedInputStream(this.getClass().getClassLoader()
		    			.getResourceAsStream("unknown-user.jpg"))) {
	    	FileCopyUtils.copy(in, response.getOutputStream());
	    } catch (IOException ioe) {
	    	response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
	    	log.info("Error retrieving file: " + f + " -- " + ioe.getMessage());
	    }
	}
	
}